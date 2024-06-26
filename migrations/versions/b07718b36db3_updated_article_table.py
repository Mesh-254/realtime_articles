"""updated article table

Revision ID: b07718b36db3
Revises: 6be97dfbe8af
Create Date: 2024-04-05 13:17:37.367972

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b07718b36db3'
down_revision = '6be97dfbe8af'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('third_level_subheading')
    op.drop_table('subheading')
    with op.batch_alter_table('article', schema=None) as batch_op:
        batch_op.drop_column('subheading_image')
        batch_op.drop_column('thirdlevel_image')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('article', schema=None) as batch_op:
        batch_op.add_column(sa.Column('thirdlevel_image', sa.VARCHAR(length=100), nullable=True))
        batch_op.add_column(sa.Column('subheading_image', sa.VARCHAR(length=100), nullable=True))

    op.create_table('subheading',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('sub_title', sa.VARCHAR(length=100), nullable=True),
    sa.Column('sub_content', sa.TEXT(), nullable=True),
    sa.Column('sub_image', sa.VARCHAR(length=100), nullable=True),
    sa.Column('article_id', sa.INTEGER(), nullable=False),
    sa.ForeignKeyConstraint(['article_id'], ['article.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('third_level_subheading',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('sub_title', sa.VARCHAR(length=100), nullable=True),
    sa.Column('sub_content', sa.TEXT(), nullable=True),
    sa.Column('sub_image', sa.VARCHAR(length=100), nullable=True),
    sa.Column('subheading_id', sa.INTEGER(), nullable=False),
    sa.ForeignKeyConstraint(['subheading_id'], ['subheading.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###
